export function getNextProblemId(direction: number = 1): string {
  const urlParams = new URLSearchParams(window.location.search);
  const currentProblemId = urlParams.get('p');
  const currentProblemNumber = parseInt(currentProblemId.match(/[0-9]{2}$/)[0]);
  const nextProblemNumber = currentProblemNumber + direction;
  const nextProblemId = currentProblemId.replace(/[0-9]{2}$/, nextProblemNumber.toString().padStart(2, '0'));
  return nextProblemId;
}
