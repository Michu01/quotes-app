function randomElement<T>(collection: T[]) {
  return collection[Math.floor(Math.random() * collection.length)]
}

function randomElementNoDuplicate<T>(collection: T[], currentValue: T, maxTrials = 10) {
  if (collection.length == 1) {
    return collection[0]
  }
  let trials = 0
  let value
  do {
    value = randomElement(collection)
    ++trials
  } while (value === currentValue && trials < maxTrials)
  return value
}

export {
  randomElement,
  randomElementNoDuplicate
}