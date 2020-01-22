#!/usr/bin/env node
'use strict'

const fs = require('fs')
const minimatch = require('minimatch')
const core = require('@actions/core')
const github = require('@actions/github')

const applyPackageLabels = async (client, args) => {
  const { rules_json_path, owner, pull_number, repo } = args

  const rules = JSON.parse(fs.readFileSync(rules_json_path, 'utf8'))
  const res = await client.request(
    `GET /repos/${owner}/${repo}/pulls/${pull_number}/files`,
  )

  if (!res || !res.status || res.status !== 200) {
    core.setFailed('error in getting changed files.')
    return
  }

  const target_labels = new Set()

  for (const file of res.data) {
    for (const rule of rules) {
      if (minimatch(file.filename, rule.path)) {
        target_labels.add(rule.label_name)
      }
    }
  }

  if (target_labels.size > 0) {
    client.issues.addLabels({
      issue_number: pull_number,
      labels: Array.from(target_labels),
      owner,
      repo,
    })
  }

  console.log({
    labels: Array.from(target_labels),
    owner,
    pull_number,
    repo,
  })
}

try {
  const token = core.getInput('token')
  const pull_number = core.getInput('pull_number')
  const rules_json_path = core.getInput('rules')
  const {
    context: {
      repo: { owner, repo },
    },
  } = github

  const client = new github.GitHub(token)
  const args = { rules_json_path, owner, pull_number, repo }

  applyPackageLabels(client, args)
    .catch(error => core.setFailed(error.message))

} catch (error) {
  core.setFailed(error.message);
}