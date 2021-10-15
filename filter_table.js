// From: https://datatables.net/extensions/fixedheader/examples/options/columnFiltering.html
function make_filterable(api, id_name) {

    let dt = $(`#${id_name}`);
    dt.css("width", "100%");

    $(`#${id_name} thead tr`)
        .clone(true)
        .addClass('filters')
        .appendTo(`#${id_name} thead`);

    // let api = doc.api();

    // For each column
    api
        .columns()
        .eq(0)
        .each(function (colIdx) {
            // Set the header cell to contain the input element
            let cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
            );
            let title = $(cell).text();
            $(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            $(
                'input',
                $('.filters th').eq($(api.column(colIdx).header()).index())
            )
                .off('keyup change')
                .on('keyup change', function (e) {
                    e.stopPropagation();

                    // Get the search value
                    $(this).attr('title', $(this).val());
                    let regexr = '({search})'; //$(this).parents('th').find('select').val();

                    let cursorPosition = this.selectionStart;
                    // Search the column for that value
                    api
                        .column(colIdx)
                        .search(
                            this.value != ''
                                ? regexr.replace('{search}', '(((' + this.value + ')))')
                                : '',
                            this.value != '',
                            this.value == ''
                        )
                        .draw();

                    $(this)
                        .focus()[0]
                        .setSelectionRange(cursorPosition, cursorPosition);
                });
        });
}
