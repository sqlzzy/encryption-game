export default async function createQrCode(qrCode, url, idRoom, dirnameSrc) {
  try {
    await qrCode.toFile(
      `${dirnameSrc}/common/images/qrCodes/${idRoom}.png`,
      url,
      {
        width: 120,
        margin: 0,
        color: {
          dark: "#40cd18cc",
          light: "#0000",
        },
      },
      function (err) {
        if (err) throw err;
      }
    );
  } catch (err) {
    console.error(err);
  }
}
