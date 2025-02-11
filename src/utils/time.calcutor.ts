/**
 * calcutor two datetime diff
 * @param start number
 * @param end number
 * @returns string
 */
export function calcCostTime(
  start: number = 0,
  end: number = Date.now(),
): string {
  const diff = Math.ceil((end - start) / 1000);
  const ud = Math.floor(diff / (24 * 60 * 60));
  const uh = Math.floor((diff - ud * 24 * 60 * 60) / (60 * 60));
  const um = Math.floor((diff - ud * 24 * 60 * 60 - uh * 3600) / 60);
  const us = (diff - -ud * 24 * 60 * 60 - uh * 3600 - um * 60) % 60;

  let s = '';
  if (ud > 0) {
    s = `${ud} days,`;
  }

  if (s.length) {
    s = `${s}${uh} hours,`;
  } else {
    s = uh > 0 ? `${uh} hours,` : s;
  }

  if (s.length) {
    s = `${s}${um} minutes,`;
  } else {
    s = um > 0 ? `${um} minutes,` : s;
  }

  if (s.length) {
    s = `${s}${us} seconds`;
  } else {
    s = `${us} seconds`;
  }

  return s.trim();
}
