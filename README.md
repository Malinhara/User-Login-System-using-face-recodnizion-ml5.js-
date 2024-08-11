
## How works

1)Save face data(face code) in Database(Register)<br>
2)When login face data(face code) pass to the backend(node js) and compare with register face data(face code)<br>
3)If match navigate to Dashboard ,if not show error message<br>


## Images

![Screenshot 2024-08-11 164710](https://github.com/user-attachments/assets/44254970-e4b2-4e2c-9de9-adb9057a2663)<br>
(can't show face due to security reasons)

## Example image

![image](https://github.com/user-attachments/assets/f64571e7-7f53-4b32-b2e4-9cb11f2e2dc5)


# IMPORTANT: Bug Fixes
## Test in the Firefox browser or google

## `navigator.getUserMedia`

`navigator.getUserMedia` is now deprecated and is replaced by `navigator.mediaDevices.getUserMedia`. To fix this bug replace all versions of `navigator.getUserMedia` with `navigator.mediaDevices.getUserMedia`

## Low-end Devices Bug

The video eventListener for `play` fires up too early on low-end machines, before the video is fully loaded, which causes errors to pop up from the Face API and terminates the script (tested on Debian [Firefox] and Windows [Chrome, Firefox]). Replaced by `playing` event, which fires up when the media has enough data to start playing.
