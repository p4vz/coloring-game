import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

export async function sharePng(png, filename) {
  const { uri } = await Filesystem.writeFile({
    path: filename,
    data: await toBase64(png),
    directory: Directory.Cache,
  })
  try {
    await Share.share({ title: filename, files: [uri] })
  } catch (e) {
    // Closing the share sheet without picking anything isn't an error for us.
    if (!/cancel/i.test(String(e?.message))) throw e
  }
}
