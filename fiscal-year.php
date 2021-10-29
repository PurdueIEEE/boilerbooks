<?php
    /*
     * This is the variable for the current fiscal year.
     * Update it at the start of every school year with the new year.
     * It is included in dbinfo, which other files then include.
     */
    $g_current_fiscal_year = "2021-2022";
    $g_first_fiscal_year = "2015-2016";

    $yearStart = intval(substr($g_first_fiscal_year, 0, 4));
    $yearEnd = intval(substr($fiscal_year_file, 0, 4));
    $g_year_options_select = "<option value=$fiscal_year_file >Select Year</option>";
    for($year = $yearEnd; $year >= $yearStart; $year--) {
        $nextYear = $year + 1;
        $g_year_options_select .= "<option value='$year-$nextYear'>$year - $nextYear</option>";
    }
?>
