import { useIntl } from '@umijs/max';
import React from 'react';

const AppTitle: React.FC = () => {
  const intl = useIntl();
  
  return (
    <span>
      {intl.formatMessage({
        id: 'app.name',
        defaultMessage: '文博探索',
      })}
    </span>
  );
};

export default AppTitle;
