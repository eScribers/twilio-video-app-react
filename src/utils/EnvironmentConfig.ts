export class EnvironmentConfig {
  environmentName: string = '';
  endPoint: string = '';

  constructor(environmentName: string, endPoint: string) {
    if (environmentName == '' || environmentName === undefined) throw new Error('environmentName is null or empty');
    if (endPoint == '' || endPoint === undefined) throw new Error('endPoint is null or empty');
    this.endPoint = endPoint;
    this.environmentName = environmentName;
  }
}
