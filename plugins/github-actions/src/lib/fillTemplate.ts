// dynamic string interpolation
// https://stackoverflow.com/questions/30003353/can-es6-template-literals-be-substituted-at-runtime-or-reused/55594573#55594573
const fillTemplate = (template, obj): string => {
  return template.replace(/\{(.*?)}/g, (_x, g) => obj[g]);
};

export default fillTemplate;
