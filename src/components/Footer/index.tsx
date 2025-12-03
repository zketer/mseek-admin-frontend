import { GithubOutlined, MailOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`© ${new Date().getFullYear()} zlynn`}
      links={[
        {
          key: '文博探索',
          title: '文博探索',
          href: '#',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/zketer',
          blankTarget: true,
        },
        {
          key: 'email',
          title: <MailOutlined />,
          href: 'mailto:museumseek@163.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
