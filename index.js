$(document).ready( function () {    
    let reports = [
        {
            title: "Customers Reports",
            tableId: "report01",
            duration: 5,
            url: "http://localhost:82/api/index.asp?id=0&connid=0"
        },
        {
            title: "Customers Reports2",
            tableId: "report02",
            duration: 2,
            url: "http://localhost:82/api/index.asp?id=1&connid=0"
        },
        {
            title: "Customers Reports3",
            tableId: "report03",
            duration: 3,
            url: "http://localhost:82/api/index.asp?id=2&connid=0",
            lengths: [[15, 25, 50, -1], [15, 25, 50, "All"]]
        }
    ]

    reports.map(report => {
        $('#menu').append(`<div id="${report.tableId}" class="report-name">${report.title}</div>`)
    });

    let timeoutCall, table, interval, actualReport;
    let recursiveCall = (id) => 
    {
        actualReport = id;
        clearInterval(interval)
        let reportCount = reports.length; 
        let report = reports[id];
        selectReport(report.tableId);
        $.get(report.url, function(data) 
        {

            let oldName = `report-${count}_wrapper`, newName = `report-${++count}`;
            let html = `<table id="${newName}"><thead><tr id="report-tr"></tr></thead></table>`
            $('.table-content').append(html);

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
            $(`#${newName}`).DataTable(Object.assign(
                data,
                {
                    lengthMenu: report.lengths ?? [[10, 25, 50, -1], [10, 25, 50, "All"]]
                }
            ));
            $(`#${oldName}`).remove()
            
        });

        timeoutCall = setTimeout(() => {
            let val = (id + 1) % reportCount
            console.log(val)
            recursiveCall(val)
        }, report.duration * 1000);
    }
    let count = 0;
    

    let selectReport = (tableId)=>{
        $('.report-name').removeClass('report-name-active')
        $(`#${tableId}`).addClass('report-name-active')
    }
    recursiveCall(0);
    
    let clearIcons = ()=>{
        $('.icon').removeClass('active')
    }

    $('.play').click(() => {
        clearIcons();
        $('.play').addClass('active');
        recursiveCall(actualReport);
    })

    let pause = () => {
        clearIcons();
        $('.pause').addClass('active');
        clearTimeout(timeoutCall);
        clearInterval(interval);
    }

    $('.pause').click(() => {
        pause();    
    })

    $('.report-name').click(event => {
        pause();
        let tableId = event.target.id;
        selectReport(tableId);
    })
});