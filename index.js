$(document).ready( function () {    
    let reports = [{
        title: "Customers Reports",
        tableId: "cust-report"
    },
    {
        title: "Customers Reports",
        tableId: "cust-report2"
    },
    {
        title: "Customers Reports",
        tableId: "cust-report3"
    }
]

    reports.map(report => {
        $('body').append(`<span class="title">${report.title}</span><table id="${report.tableId}"></table>`)
        $.get("http://localhost:82/api/index.asp", function(data) 
        {
            $(`#${report.tableId}`).append(`<thead><tr id="${report.tableId}-tr"> </tr></thead>`)    
            data.columns.map(col => {
                $(`#${report.tableId}-tr`).append(`<th>${col.data}</th>`)    
            });
            $(`#${report.tableId}`).DataTable(data);
        });
    })
        
});