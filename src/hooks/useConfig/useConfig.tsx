import { useEffect, useState } from 'react';

interface IConfig {
  loading: boolean;
  loaded: boolean;
  endPoint: string | undefined;
  environmentName: string | undefined;
  domainName: string | undefined;
  buildId: string | undefined;
}

const initialState = {
  loading: false,
  loaded: false,
  endPoint: undefined,
  environmentName: undefined,
  domainName: undefined,
  buildId: undefined,
};

const public_url = process.env.PUBLIC_URL;

const useConfig = ({ setError }) => {
  const [config, setConfig] = useState<IConfig>(initialState);

  const getFile = async () => {
    try {
      const request = await fetch(`${public_url}/config.json`);
      const response = await request.json();
      setConfig({ ...response, loaded: true, loading: false });
    } catch (err) {
      setConfig({ ...initialState, loading: false, loaded: false });
      setError({ message: `Could not fetch data from ${public_url}/config.json` });
    }
  };

  useEffect(() => {
    setConfig({ ...initialState, loaded: false, loading: true });
    getFile();
    // eslint-disable-next-line
  }, []);

  return config;
};

export default useConfig;
