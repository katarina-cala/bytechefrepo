---
title: "Google Sheets"
description: "Google Sheets is a cloud-based spreadsheet software that allows users to create, edit, and collaborate on spreadsheets in real-time."
---
## Reference
<hr />

Google Sheets is a cloud-based spreadsheet software that allows users to create, edit, and collaborate on spreadsheets in real-time.


Categories: [productivity-and-collaboration]


Version: 1

<hr />



## Connections

Version: 1


### OAuth2 Authorization Code

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Client Id | STRING | TEXT  |  |
| Client Secret | STRING | TEXT  |  |





<hr />



## Triggers


### New Row
Triggers when a new row is added.

#### Type: DYNAMIC_WEBHOOK
#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Is the first row headers? | BOOLEAN | SELECT  |  If the first row is header  |
| Sheet | STRING | SELECT  |  The name of the sheet  |


### Output



Type: ARRAY


#### Properties

|     Type     |     Control Type     |
|:------------:|:--------------------:|
| {} | OBJECT_BUILDER  |







<hr />



## Actions


### Clear sheet
Clear a sheet of all values while preserving formats.

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | INTEGER | SELECT  |  The name of the sheet  |
| Is the first row headers? | BOOLEAN | SELECT  |  If the first row is header  |




### Create column
Append a new column to the end of the sheet.

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | STRING | SELECT  |  The name of the sheet  |
| Column name | STRING | TEXT  |  Name of the new column.  |


### Output



Type: OBJECT


#### Properties

|     Type     |     Control Type     |
|:------------:|:--------------------:|
| STRING | TEXT  |
| STRING | TEXT  |
| [BOOLEAN, NUMBER, STRING] | ARRAY_BUILDER  |






### Create sheet
Create a blank sheet with title. Optionally, provide headers.

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Sheet name | STRING | TEXT  |  The name of the new sheet.  |
| Headers | [BOOLEAN, NUMBER, STRING] | ARRAY_BUILDER  |  The headers of the new sheet.  |


### Output



Type: OBJECT







### Delete row
Delete row on an existing sheet

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | INTEGER | SELECT  |  The name of the sheet  |
| Row number | INTEGER | INTEGER  |  The row number to delete  |




### Find row by number
Get a row in a Google Sheet by row number

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | STRING | SELECT  |  The name of the sheet  |
| Is the first row headers? | BOOLEAN | SELECT  |  If the first row is header  |
| Row number | INTEGER | INTEGER  |  The row number to get from the sheet.  |


### Output



Type: OBJECT







### Insert multiple rows
Append rows to the end of the spreadsheet.

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | STRING | SELECT  |  The name of the sheet  |
| Value input option | STRING | SELECT  |  How the input data should be interpreted.  |
| Is the first row headers? | BOOLEAN | SELECT  |  If the first row is header  |
| DYNAMIC_PROPERTIES | null  |


### Output



Type: ARRAY


#### Properties

|     Type     |     Control Type     |
|:------------:|:--------------------:|
| {} | OBJECT_BUILDER  |






### Insert row
Append a row of values to an existing sheet

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | STRING | SELECT  |  The name of the sheet  |
| Value input option | STRING | SELECT  |  How the input data should be interpreted.  |
| Is the first row headers? | BOOLEAN | SELECT  |  If the first row is header  |
| DYNAMIC_PROPERTIES | null  |


### Output



Type: OBJECT







### Update row
Overwrite values in an existing row

#### Properties

|      Name      |     Type     |     Control Type     |     Description     |
|:--------------:|:------------:|:--------------------:|:-------------------:|
| Spreadsheet | STRING | SELECT  |  The spreadsheet to apply the updates to.  |
| Include sheets from all drives | BOOLEAN | SELECT  |  Whether both My Drive and shared drive sheets should be included in results.  |
| Sheet | STRING | SELECT  |  The name of the sheet  |
| Row number | INTEGER | INTEGER  |  The row number to update  |
| Is the first row headers? | BOOLEAN | SELECT  |  If the first row is header  |
| DYNAMIC_PROPERTIES | null  |


### Output



Type: OBJECT







<hr />

# Additional instructions
<hr />

![anl-c-google-sheet-md](https://static.scarf.sh/a.png?x-pxid=825c028e-5578-4a96-841e-0c91c0fa1134)
## CONNECTION

[Setting up OAuth2](https://support.google.com/googleapi/answer/6158849?hl=en)

<div style="position:relative;height:0;width:100%;overflow:hidden;z-index:99999;box-sizing:border-box;padding-bottom:calc(50.05219207% + 32px)"><iframe src="https://www.guidejar.com/embed/fec74020-26bb-43dd-814c-f8b907f6f45b?type=1&controls=on" width="100%" height="100%" style="position:absolute;inset:0" allowfullscreen frameborder="0"></iframe></div>

Turning on Sheets API <div style="position:relative;height:0;width:100%;overflow:hidden;z-index:99999;box-sizing:border-box;padding-bottom:calc(50.05219207% + 32px)"><iframe src="https://www.guidejar.com/embed/61d6b773-ad2d-49c3-9c9c-d0b906cd5086?type=1&controls=on" width="100%" height="100%" style="position:absolute;inset:0" allowfullscreen frameborder="0"></iframe></div>
