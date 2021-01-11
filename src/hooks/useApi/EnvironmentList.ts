import React from 'react';
import { EnvironmentConfig } from '../../utils/EnvironmentConfig';
import { apiStates, useApi } from './useApi';

export const useEnvironment = () => {
  const { state, error, data } = useApi(`${process.env.PUBLIC_URL}/config.json`);

  switch (state) {
    case apiStates.ERROR: {
      console.log(error || 'General error');
      return null;
    }
    case apiStates.SUCCESS:
      return new EnvironmentConfig(data.environmentName, data.endPoint);
    default:
      return null;
  }
};
