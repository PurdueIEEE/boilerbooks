<?php
    /*
     * This is the variable for the current fiscal year.
     * Update it at the start of every school year with the new year.
     * It is included in dbinfo, where it sets current_fiscal_year for other files to reference it.
     */
    $fiscal_year_file = "2020-2021";
    $first_fiscal_year_file = "2015-2016";

    $yearStart = intval(substr($first_fiscal_year_file, 0, 4));
    $yearEnd = intval(substr($fiscal_year_file, 0, 4));
    $year_options_file = "<option value=$fiscal_year_file >Select Year</option>";
    for($year = $yearEnd; $year >= $yearStart; $year--) {
        $nextYear = $year + 1;
        $year_options_file .= "<option value='$year-$nextYear'>$year - $nextYear</option>";
    }
?>
