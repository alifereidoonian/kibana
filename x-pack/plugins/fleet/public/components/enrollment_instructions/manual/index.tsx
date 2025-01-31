/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import styled from 'styled-components';
import { EuiText, EuiSpacer, EuiLink, EuiCodeBlock, EuiButtonGroup } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { i18n } from '@kbn/i18n';

import type { EnrollmentAPIKey } from '../../../types';
import { PLATFORM_OPTIONS, usePlatform, useStartServices } from '../../../hooks';
import type { PLATFORM_TYPE } from '../../../hooks';

interface Props {
  fleetServerHosts: string[];
  apiKey: EnrollmentAPIKey;
}

// Otherwise the copy button is over the text
const CommandCode = styled.pre({
  overflow: 'scroll',
});

function getfleetServerHostsEnrollArgs(apiKey: EnrollmentAPIKey, fleetServerHosts: string[]) {
  return `--url=${fleetServerHosts[0]} --enrollment-token=${apiKey.api_key}`;
}

export const ManualInstructions: React.FunctionComponent<Props> = ({
  apiKey,
  fleetServerHosts,
}) => {
  const { platform, setPlatform } = usePlatform();
  const { docLinks } = useStartServices();

  const enrollArgs = getfleetServerHostsEnrollArgs(apiKey, fleetServerHosts);

  const linuxMacCommand = `sudo ./elastic-agent install ${enrollArgs}`;

  const windowsCommand = `.\\elastic-agent.exe install ${enrollArgs}`;

  return (
    <>
      <EuiText>
        <FormattedMessage
          id="xpack.fleet.enrollmentInstructions.descriptionText"
          defaultMessage="From the agent directory, run the appropriate command to install, enroll, and start an Elastic Agent. You can reuse these commands to set up agents on more than one host. Requires administrator privileges."
        />
      </EuiText>
      <EuiSpacer size="l" />
      <EuiButtonGroup
        options={PLATFORM_OPTIONS}
        idSelected={platform}
        onChange={(id) => setPlatform(id as PLATFORM_TYPE)}
        legend={i18n.translate('xpack.fleet.enrollmentInstructions.platformSelectAriaLabel', {
          defaultMessage: 'Platform',
        })}
      />
      <EuiSpacer size="s" />
      {platform === 'linux-mac' && (
        <EuiCodeBlock fontSize="m" isCopyable={true} paddingSize="m">
          <CommandCode>{linuxMacCommand}</CommandCode>
        </EuiCodeBlock>
      )}
      {platform === 'windows' && (
        <EuiCodeBlock fontSize="m" isCopyable={true} paddingSize="m">
          <CommandCode>{windowsCommand}</CommandCode>
        </EuiCodeBlock>
      )}

      {platform === 'rpm-deb' && (
        <EuiText>
          <FormattedMessage
            id="xpack.fleet.enrollmentInstructions.moreInstructionsText"
            defaultMessage="See the {link} for RPM / DEB deploy instructions."
            values={{
              link: (
                <EuiLink target="_blank" external href={docLinks.links.fleet.installElasticAgent}>
                  <FormattedMessage
                    id="xpack.fleet.enrollmentInstructions.moreInstructionsLink"
                    defaultMessage="Elastic Agent docs"
                  />
                </EuiLink>
              ),
            }}
          />
        </EuiText>
      )}

      <EuiSpacer size="l" />
      <EuiText>
        <FormattedMessage
          id="xpack.fleet.enrollmentInstructions.troubleshootingText"
          defaultMessage="If you are having trouble connecting, see our {link}."
          values={{
            link: (
              <EuiLink target="_blank" external href={docLinks.links.fleet.troubleshooting}>
                <FormattedMessage
                  id="xpack.fleet.enrollmentInstructions.troubleshootingLink"
                  defaultMessage="troubleshooting guide"
                />
              </EuiLink>
            ),
          }}
        />
      </EuiText>
    </>
  );
};
