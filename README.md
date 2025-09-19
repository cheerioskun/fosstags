# fosstags
A simple service mapping from QR code based nametags to JSON data of the nametag.

## Usage
1. Create a nametag with a QR code pointing to `https://tags.phemantics.xyz/<your-identifier>`.
2. Can scan the QR code with any QR code scanner. If claimed, it will show the JSON data. Maybe even a frontend on top.
3. To claim a tag, send a POST request to `https://tags.phemantics.xyz/claim` with JSON body:
   ```json
   {
     "identifier": "adjective-noun",
     "data": {
       "name": "Your Name",
       "email": "me@hello.me",
       "bio": "<100 character bio, enforced",
       "x": "phemantics",
       "github": "cheerioskun",
       "linkedin": "your-linkedin",
     },
  }
4. Nothing
