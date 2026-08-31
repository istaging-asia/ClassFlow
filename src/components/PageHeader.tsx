import { Typography } from 'antd';
import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  description,
  extra,
}: {
  title: string;
  description?: string;
  extra?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
      }}
    >
      <div>
        <Typography.Title level={3} style={{ margin: 0, letterSpacing: -0.4 }}>
          {title}
        </Typography.Title>
        {description && (
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            {description}
          </Typography.Text>
        )}
      </div>
      {extra}
    </div>
  );
}
