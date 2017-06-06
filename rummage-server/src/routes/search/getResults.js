const Request = require('request');

const {
  SEARCH_HOST,
  SEARCH_PATH,
  SEARCH_USERNAME,
  SEARCH_PASSWORD
} = process.env;

const requestUrl = `${SEARCH_HOST}${SEARCH_PATH}`;
const maxNumberOfResults = 5000;

function getResults(searchKeywords = '', callback) {
  const requestParams = `fly=2&gps=${searchKeywords}&SelectOther=ARCHIVE&safeO=0&sb=1&pno=1&chxu=1&pby=${maxNumberOfResults}&u=1&chxgx=1&st=basic&s1=dtime&s1d=-&sS=3&vv=1&fty[]=VIDEO`;

  Request.get(requestUrl + requestParams, {
    'auth': {
      'user': SEARCH_USERNAME,
      'pass': SEARCH_PASSWORD
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const jsonResponse = JSON.parse(body);

      const {
        downURL: downloadRoot,
        thumbURL: thumbnailRoot,
        downloadFarm,
        data: results
      } = jsonResponse;

      const secureDownloadRoot = downloadRoot.replace('http://', 'https://') + '/' + downloadFarm + '/443/'
      const secureThumbnailRoot = thumbnailRoot.replace(/https:\/\/.*\/thumbnails/, 'thumbnails');

      const renamedResults = results.map(item => {
        const {
          type,
          '2': extension,
          fullres: resolution,
          height,
          width,
          '4': formattedSize,
          rawSize: sizeInBytes,
          '10': filename,
          '14': formattedDuration,
          '5': postDateAndTime,
          '12': videoCodec,
          '18': audioCodec,
          '0': internalFilename,
          '35': internalFilenameSuffix,
          '19': internalThumbnailFilename,
          alangs: audioLanguages,
          slangs: subtitleLanguages
        } = item;

        const downloadUrl = secureDownloadRoot +
          internalFilename +
          internalFilenameSuffix +
          extension + '/' +
          encodeURIComponent(filename) +
          extension;

        const thumbnailPath = `${secureThumbnailRoot}${internalFilename.substr(0, 3)}/th-${internalFilename}.jpg/th-${filename}.jpg`;

        const sizeInMegabytesFloat = sizeInBytes / 1024 / 1024;
        const sizeInMegabytes = Math.floor(sizeInMegabytesFloat);

        return {
          extension: extension.toLowerCase(),
          type: type.toLowerCase(),
          resolution,
          height,
          width,
          formattedSize,
          sizeInBytes,
          filename,
          formattedDuration,
          postDateAndTime,
          videoCodec,
          audioCodec,
          downloadUrl,
          thumbnailPath,
          sizeInMegabytes,
          audioLanguages,
          subtitleLanguages
        };
      });

      // const filterFunction = ({
      //   sizeInMegabytes,
      //   width,
      //   filename
      // }) => {
      //   const isMinSize = sizeInMegabytes >= minSizeInMegabytes;
      //   const isMinWidth = width >= minWidth;
      //   const isScreener = filename.toLowerCase().indexOf('screener') >= 0;

      //   return isMinSize && isMinWidth && !isScreener;
      // };

      // let filteredResults = slimResults.filter(filterFunction);

      // console.log(JSON.stringify(results, null, 2));
      // alangs: if array is not empty, it should include "eng", would prefer if it ONLY included "eng"
      // console.log(JSON.stringify(filteredResults, null, 2));
      // console.log(`numberOfResults = ${filteredResults.length}`);
      callback(renamedResults);
    }
  });
}

module.exports = getResults;
