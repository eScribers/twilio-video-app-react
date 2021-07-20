window.HTMLMediaElement.prototype.load = () => {
  /* do nothing */
};
window.HTMLMediaElement.prototype.play = async () => {
  /* do nothing */
};
window.HTMLMediaElement.prototype.pause = () => {
  /* do nothing */
};
window.HTMLMediaElement.prototype.addTextTrack = (_kind, _label: string | undefined, _language: string | undefined) =>
  ({} as TextTrack);

export {};
