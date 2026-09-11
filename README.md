# 6th Anniversary Payment Gateway & Transaction Recorder

Welcome to the **6th Anniversary Payment Gateway & Transaction Recorder**! This is a modern, premium, glassmorphism-designed payment interface celebrating 6 years of trust. It displays a dynamically-generated UPI payment QR code, validates transaction verification fields (Name, UPI ID, Transaction ID), saves them directly to a Google Sheet, and rewards the user with spectacular confetti party bombers and thank you animations upon completion.

---

## 🚀 Getting Started

Simply open `index.html` in any web browser!
By default, the application runs in **Offline/Demo Mode**, meaning it will simulate a network submission, display the celebratory confetti, and show the animated "Thank You" receipt summary without saving to Google Sheets.

To hook it up to your actual Google Sheets database, follow the integration guide below.

---

## 📊 Google Sheets Integration Guide

This app uses a serverless Google Apps Script to save submission details to your Google Sheet without exposing any private credentials.

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Give it a name (e.g., *Anniversary Payments Database*).
3. (Optional) Create column headers in the first row:
   - **Column A**: Date & Time
   - **Column B**: Customer Name
   - **Column C**: Sender UPI ID
   - **Column D**: Transaction ID (UTR)

### Step 2: Open the Apps Script Editor
1. In your Google Sheet menu bar, click on **Extensions** > **Apps Script**.
2. Delete any default code in the editor (the empty `myFunction`).

### Step 3: Paste the App Script Code
Copy and paste the following script into the editor:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var name = "";
    var upiId = "";
    var transactionId = "";
    
    // Attempt parsing JSON payload
    if (e.postData && e.postData.contents) {
      try {
        var data = JSON.parse(e.postData.contents);
        name = data.name;
        upiId = data.upiId;
        transactionId = data.transactionId;
      } catch (err) {
        // Fallback for form parameters
        name = e.parameter.name;
        upiId = e.parameter.upiId;
        transactionId = e.parameter.transactionId;
      }
    } else {
      name = e.parameter.name;
      upiId = e.parameter.upiId;
      transactionId = e.parameter.transactionId;
    }
    
    // Row format: Timestamp, Name, UPI ID, Transaction ID
    sheet.appendRow([new Date(), name, upiId, transactionId]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*'
      });
  }
}

// Handle CORS Preflight Options request
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

### Step 4: Save & Deploy
1. Click the **Save** disk icon at the top of the script editor.
2. Click the **Deploy** button on the top right, then select **New deployment**.
3. Click the gear icon next to "Select type" and choose **Web app**.
4. Configure the settings:
   - **Description**: `Payment Record Web Service`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: This allows the webpage to submit form submissions).*
5. Click **Deploy**.
6. Google will request authorization. Click **Authorize access**, log in with your account, click **Advanced**, and then click **Go to Untitled project (unsafe)** to grant permissions.
7. Once successfully deployed, copy the **Web app URL** (it ends with `/exec`).

### Step 5: Link the Web App URL to the Gateway
1. Open the Payment Gateway page in your browser.
2. Click the **Gear icon** in the top-right corner to open the **Merchant Configuration** drawer.
3. Paste the copied Google Web App URL in the *Google Apps Script Web App URL* field.
4. Customize your **Receiver UPI ID** (e.g. `yourname@okaxis`) and **Receiver Name** (e.g. `My Business Store`).
5. Click **Save Settings**.

Your settings will be securely stored in your browser's local storage. Any future submission will write directly to your Google Sheet!

---

## 💎 Features & Customization
- **Self-Generating UPI QR Code**: Uses the stable `qrserver.com` API to turn payment links into scanable QR codes.
- **Input Validation**: Verifies name fields, formats UPI accounts properly, and requires exactly 12 digits for the bank verification transaction ID (UTR).
- **Celebration Confetti**: Employs `canvas-confetti` to fire dual-bottom party bombers that fill the screen with golden, purple, and rose colors on submission.
- **Glassmorphism Theme**: Created with sophisticated backdrop filters, deep colors, floating balloons, twinkling starry backgrounds, and fluid visual animations.
