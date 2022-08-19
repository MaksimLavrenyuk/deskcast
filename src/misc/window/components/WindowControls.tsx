import classNames from 'classnames';
import React from 'react';
import context from '../titlebarContextApi';

type Props = {
  platform: string;
  tooltips?: boolean;
};

function WindowControls(props: Props) {
  const { platform, tooltips } = props;

  return (
    <section
      className={classNames(
        'window-titlebar-controls',
        `type-${platform}`,
      )}
    >
      <div
        className="control minimize"
        onClick={() => context.minimize()}
        title={tooltips ? 'Minimize' : null}
      >
        ─
      </div>
      <div
        className="control maximize"
        onClick={() => context.toggle_maximize()}
        title={tooltips ? 'Maximize' : null}
      >
        ☐
      </div>
      <div
        className="control close"
        onClick={() => context.exit()}
        title={tooltips ? 'Close' : null}
      >
        X
      </div>
    </section>
  );
}

export default WindowControls;
