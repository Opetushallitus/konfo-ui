const fs = require('node:fs');
const exec = require('node:child_process').execSync;
const core = require('@actions/core');

const fieldEqual = (masterField, testiField) => {
  return masterField.id === testiField.id
    && masterField.type === testiField.type
    && masterField.localized === testiField.localized
    && masterField.required === testiField.required
    && masterField.disabled === testiField.disabled
    && masterField.omitted === testiField.omitted
}

const compareType = (masterType, testiType) => {
  const differences = {};

  if (masterType.description !== testiType.description) {
    differences['description'] = {error: 'differences', master: masterType.description, testi: testiType.description};
  }

  masterType.fields.forEach((masterField) => {
    const testiField = testiType.fields.find((field) => field.id === masterField.id);
    if (!testiField) {
      differences[masterField.id] = {error: 'missing from testi'}
    } else if (!fieldEqual(masterField, testiField)){
      differences[masterField.id] = {error: 'differences', master: masterField, testi: testiField}
    }
  })

  testiType.fields.forEach((testiField) => {
    const hasMasterField = masterType.fields.some((field) => field.id === testiField.id);
    if (!hasMasterField) {
      differences[testiField.id] = {error: 'missing from master'}
    }
  })

  return differences;
}

const commonFlags = `--skip-content --skip-roles --skip-webhooks --skip-editor-interfaces --mt ${process.env.MANAGEMENT_TOKEN}`

const compareTypes = (spaceId) => {
  exec(`contentful space export --space-id ${spaceId} --environment-id master --content-file master.json ${commonFlags}`) //NOSONAR
  exec(`contentful space export --space-id ${spaceId} --environment-id testi --content-file testi.json ${commonFlags}`) //NOSONAR
  const masterTypes = JSON.parse(fs.readFileSync('master.json', 'utf8')).contentTypes;
  const testiTypes = JSON.parse(fs.readFileSync('testi.json', 'utf8')).contentTypes;

  const diff = {};

  masterTypes.forEach((masterType) => {
    const testiType = testiTypes.find((type) => type.name === masterType.name);
    if (!testiType) {
      diff[masterType.name] = {error: 'missing from testi'};
    } else {
      const typeDiff = compareType(masterType, testiType);
      if (Object.keys(typeDiff).length > 0) {
        diff[masterType.name] = typeDiff;
      }
    }
  })
  testiTypes.forEach((testiType) => {
    const masterType = masterTypes.find((type) => type.name === testiType.name);
    if (!masterType) {
      diff[testiType.name] = {error: 'missing from master'};
    } else {
      const typeDiff = compareType(masterType, testiType);
      if (Object.keys(typeDiff).length > 0) {
        diff[testiType.name] = typeDiff;
      }
    }
  })

  return diff;
}

const spaceIdFI = process.env.SPACE_ID_FI_SV;
const spaceIdEN = process.env.SPACE_ID_EN;

const diff = {fi: compareTypes(spaceIdFI), en: compareTypes(spaceIdEN)};

if (Object.keys(diff.fi).length > 0 || Object.keys(diff.en).length > 0) {
  core.setFailed('Differences in content types');
  core.info(JSON.stringify(diff, undefined, 2));
}