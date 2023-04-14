var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.util = io.github.shunshun94.util || {};
io.github.shunshun94.util.table = io.github.shunshun94.util.table || {};
io.github.shunshun94.util.table.roundRobinTournament = io.github.shunshun94.util.table.roundRobinTournament || {};

io.github.shunshun94.util.table.roundRobinTournament.generateFromText = (text, separator='\t') => {
    const tableArray = text.trim().split('\n').map((l)=>{return l.split(separator)});
    while(tableArray[0].length < tableArray[1].length) {tableArray[0].unshift('');}
    const resultTableHtml = document.createElement('table');
    resultTableHtml.setAttribute('border', 1);
    tableArray.forEach((row, rowIndex)=>{
        const rowHtml = document.createElement('tr');
        row.forEach((col, colIndex)=>{
            const cell = document.createElement( (rowIndex && colIndex) ? 'td' : 'th' );
            cell.className = (( rowIndex ? `row_${rowIndex}` : '' ) + ' ' + ( colIndex ? `col_${colIndex}` : '' )).trim();
            cell.textContent = col;
            rowHtml.append(cell);
        });
        resultTableHtml.append(rowHtml);
    });
    return {
        table: resultTableHtml, list: tableArray[0]
    };
};

