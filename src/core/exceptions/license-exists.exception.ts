export class LicenseExistsException extends Error {
  constructor(license: string) {
    super(`La licencia ${license} ya está registrada`);
    this.name = 'LicenseExistsException';
  }
}
