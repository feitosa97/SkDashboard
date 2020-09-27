<% 

Set cnn = Server.CreateObject("ADODB.Connection")
cnn.open "PROVIDER=SQLOLEDB;DATA SOURCE=localhost;UID=sa;PWD=P@55w0rd;DATABASE=Nexp;"



set rs = Server.CreateObject("ADODB.recordset")
sql="Select Id, ConsumerKey, Name, Slug From Customers"
rs.Open sql, cnn


Dim data, columns, columnCount, colIndex, rowIndex, rowCount, rsArray
If Not rs.EOF Then
    data = """data"": ["
    columns = """columns"": ["
    rsArray = rs.GetRows()
    rowIndex = 0
End If
'Retrieve the total no. of rows (second dimension of the array)
rowCount = ubound(rsArray,2)
'Retrive the total no. of columns/fields (first dimension of the array)
columnCount = ubound(rsArray,1)
'Loop through the array holding the resultset and display records
'Loop through rows as the outer loop
For rowIndex = 0 to rowCount
    data = data & "{"
    'Loop through columns/fields as inner loop
    For colIndex = 0 to columnCount
        data = data & """" & rs.Fields(colIndex).Name & """" & ":""" & rsArray(colIndex,rowIndex) & """"
        
        If rowIndex = 0 Then
            columns = columns & "{""data"": """ & rs.Fields(colIndex).Name & """}"
            If colIndex < columnCount Then 
                columns = columns & ","
            End If
        End If
        If colIndex < columnCount Then
            data = data & ","
        End If
    Next 'Move on to next column/field is there is one
    data = data & "}"
    If rowIndex < rowCount Then
        data = data & ","
    End If
Next 'Move on to next row if there is one
data = data & "]"
columns = columns & "]"

rs.Close
JSONData = "{" & data & "," & columns & "}"

Response.ContentType = "application/json"
Response.Write JSONData
%>

