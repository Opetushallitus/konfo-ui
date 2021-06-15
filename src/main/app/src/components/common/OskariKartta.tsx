import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';
import { urls } from 'oph-urls-js';
// @ts-ignore no types
import OskariRPC from 'oskari-rpc';

import { getLanguage } from '#/src/tools/localization';
import { getSearchAddress } from '#/src/tools/utils';

const MARKER_ID = 'OPPILAITOS';
const ZOOM_LEVEL = 9;
const expectedOskariVersion = '2.1.0'; // TODO: current npm is 2.1.0 but response says 2.2.0 should be used

const createChannel = (id: string) => {
  const IFRAME_DOMAIN = urls.url('kartta.base-url');
  const iFrame = document.getElementById(id);
  const channel = OskariRPC.connect(iFrame, IFRAME_DOMAIN);
  return channel;
};

type Props = {
  id: string;
  osoite: string;
  postitoimipaikka: string;
};

type SearchData = {
  requestParameters: string;
  result: {
    locations: Array<{
      lat: number;
      lon: number;
      name: string;
      region: string;
      village: string;
    }>;
    totalCount: number;
  };
  success: boolean;
};

export const OskariKartta = ({ id, osoite, postitoimipaikka }: Props) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const channel = createChannel(id);
    let noHouseNumberSearchDone = false;

    channel.handleEvent('SearchResultEvent', (data: SearchData) => {
      if (!data?.success) {
        setError(true);
        return;
      }
      if (data?.result?.locations?.length > 0) {
        const { lon, lat, name } =
          data?.result?.locations?.find((loc) =>
            [loc?.region?.toLowerCase(), loc?.village?.toLowerCase()].includes(
              postitoimipaikka.toLowerCase()
            )
          ) ?? data.result.locations[0];

        channel.postRequest('MapMoveRequest', [lon, lat, ZOOM_LEVEL]);

        const requestData = {
          x: lon,
          y: lat,
          color: 'ff0000',
          msg: name,
          shape: 2, // icon number (0-6)
          size: 4,
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [requestData, MARKER_ID]);
      } else if (!noHouseNumberSearchDone) {
        const { addressNoNumbers } = getSearchAddress(postitoimipaikka, osoite);
        channel.postRequest('SearchRequest', [addressNoNumbers]);
        noHouseNumberSearchDone = true;
      } else {
        setError(true);
      }
    });

    channel.onReady((info: { clientSupported: boolean; version: string }) => {
      if (!info.clientSupported) {
        channel.log(
          `Oskari reported client version (${OskariRPC.VERSION}) is not supported. 
          The client might work, but some features are not compatible.`
        );
      } else {
        if (info.version !== expectedOskariVersion) {
          channel.log(
            `Oskari-instance is not the one we expect (${expectedOskariVersion})`
          );
          channel.log('Current Oskari-instance reports version as: ', info);
        }
      }

      if (channel) {
        const { address } = getSearchAddress(postitoimipaikka, osoite);
        channel.postRequest('SearchRequest', [address]);
      } else {
        console.error(
          'Odottamaton virhe. Karttapalvelun channel puuttuu',
          urls.url('kartta.base-url')
        );
      }
    });

    return () => {
      channel?.destroy();
    };
  }, [id, postitoimipaikka, osoite]);

  return (
    <Grid
      item
      container
      justify="center"
      md={6}
      sm={12}
      // Ei poisteta domista vaan piilotetaan koska channel eventit räjähtää mikäli dom-elementti puuttuu
      style={{ ...(error && { flexBasis: 0, height: 0, visibility: 'hidden' }) }}>
      <iframe
        title="kartta"
        id={id}
        style={{ border: 'none', width: '100%', minHeight: 320 }}
        src={urls.url('kartta.publish-url', getLanguage())}
      />
    </Grid>
  );
};
