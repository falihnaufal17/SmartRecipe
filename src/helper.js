export function firstLetterCapital(str) {
  if (typeof str === 'string')
    return str?.charAt(0).toUpperCase() + str?.substring(1)
  return '-'
}