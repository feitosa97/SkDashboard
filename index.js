$(document).ready( function () {    
    let reports = [
        {
            title: "Customers Reports",
            tableId: "cust-report",
            duration: 5,
            url: "http://localhost:82/api/index.asp"
        },
        {
            title: "Customers Reports2",
            tableId: "cust-report2",
            duration: 2,
            url: "http://localhost:82/api/index.asp"
        },
        {
            title: "Customers Reports3",
            tableId: "cust-report3",
            duration: 3,
            url: "http://localhost:82/api/index.asp"
        }
    ]

    reports.map(report => {
        $('#menu').append(`<div id="${report.tableId}" class="report-name">${report.title}</div>`)
    });

    let timeoutCall, table, interval;
    let recursiveCall = (id) => 
    {
        clearInterval(interval)
        let reportCount = reports.length; 
        let report = reports[id];
        selectReport(report.tableId);
        $.get(report.url, function(data) 
        {
            if(table) table.destroy();
            $(`#report-tr`).empty();
            $('#title').text(report.title);
            let time = 0;
            interval = setInterval(() => {
                time++; 
                $('.progress').width((time * 10 / report.duration)+ '%')
            }, 100); 
            data.columns.map(col => {
                $(`#report-tr`).append(`<th>${col.data}</th>`)    
            });
            table = $(`#report`).DataTable(data);
            
        });

        timeoutCall = setTimeout(() => {        
            recursiveCall((id + 1) % reportCount)
        }, report.duration * 1000);
    }

    let selectReport = (tableId)=>{
        $('.report-name').removeClass('report-name-active')
        $(`#${tableId}`).addClass('report-name-active')
    }
    recursiveCall(0);
        
});