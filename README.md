# IMPORTANT: Bug Fixes
## Test in the Firefox browser or google

## `navigator.getUserMedia`

`navigator.getUserMedia` is now deprecated and is replaced by `navigator.mediaDevices.getUserMedia`. To fix this bug replace all versions of `navigator.getUserMedia` with `navigator.mediaDevices.getUserMedia`

## Low-end Devices Bug

The video eventListener for `play` fires up too early on low-end machines, before the video is fully loaded, which causes errors to pop up from the Face API and terminates the script (tested on Debian [Firefox] and Windows [Chrome, Firefox]). Replaced by `playing` event, which fires up when the media has enough data to start playing.

##Images

![Screenshot 2024-08-11 164710](https://github.com/user-attachments/assets/44254970-e4b2-4e2c-9de9-adb9057a2663)(can't show face due to security reason)
