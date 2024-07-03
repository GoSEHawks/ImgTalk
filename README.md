# ImgTalk
Image talker, select and image make word maps and talk in a secure way. NOTE: the *source* image can literally be anywhere or anything

**Educational Program Disclaimer**

**Program Title:** Understanding Image Manipulation

**Purpose:** This educational program is designed to demonstrate and explain the step-by-step process of image processing, from loading an image to applying filters and effects.

**Disclaimer:**

* This program is for educational purposes only and should not be used for commercial or production purposes.
* The program is provided "as is" without warranty of any kind, express or implied.
* The program may contain errors, inaccuracies, or omissions, and the user assumes all risks associated with its use.
* The program is not intended to be a professional-grade image processing tool, and its output should not be considered suitable for publication or distribution.
* By using this program, you acknowledge that you understand and agree to these terms and conditions.

**Learning Objectives:**

* Understand the basics of image processing and its applications
* Learn how to load and manipulate images using Electron.js
* Manipulate images for "other" uses
* Analyze and troubleshoot apps

By using this program, you acknowledge that you have read, understood, and agree to the terms and conditions outlined in this disclaimer.

** see below images of the app use and functionality for renfrence. Clone, install electron and dependencies then run with "npx electronmon ." command to get started.

![Screenshot 2024-07-03 111257](https://github.com/GoSEHawks/ImgTalk/assets/45705923/b6f8bdbb-6fad-4e8d-afc3-33b02e55fd43)
![Screenshot 2024-07-03 111357](https://github.com/GoSEHawks/ImgTalk/assets/45705923/ee4971d5-5c02-42f5-ac4e-83faf5a6a33d)
![Screenshot 2024-07-03 111633](https://github.com/GoSEHawks/ImgTalk/assets/45705923/bf595570-07f5-46b1-8ba9-5b1e267cbe9d)

**Strong points:**

1. **Image-specific hex locations**: The hex locations are unique to each image, making it virtually impossible for an attacker to use a generic hex location string to access the encoded data.
2. **Image-specific hex-to-character map**: The hex-to-character map is also unique to each image, adding an additional layer of obscurity and security.
3. **Decentralized storage**: Storing the image in an abundant online source makes it more difficult for an attacker to access the encoded data.
4. **Needle in a haystack problem**: Even if an attacker had the hex location string, they would still need to find the correct image out of the vast number of unique images on the internet, making it a virtually impossible task.

**Weak points:**
*both of these are trivial and are not the point 
1. **Image integrity**: If the image is tampered with or modified, the encoded data may be compromised.
2. **Image availability**: If the image is deleted or becomes unavailable, the encoded data may be lost or inaccessible.
