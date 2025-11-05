export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

 

    //MÉTODO PRINCIPAL - REFACTORED
  
  generateReport(reportType, user, items) {
    const header = this._generateHeader(reportType, user);
    
    const visibleItems = this._filterItems(items, user);
    
    const bodyResult = this._generateBody(visibleItems, user, reportType);
    
    const footer = this._generateFooter(reportType, bodyResult.total);

    return (header + bodyResult.report + footer).trim();
  }

  
    //MÉTODOS AUXILIARES SEPARADOS E REFATORADOS

  _generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }
    
    if (reportType === 'HTML') {
      return `<html><body>
<h1>Relatório</h1>
<h2>Usuário: ${user.name}</h2>
<table>
<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>
`;
    }
    return '';
  }

  _filterItems(items, user) {
    if (user.role === 'ADMIN') {
      return items; 
    }
    
    
    if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }
    
    return []; 
  }

 
  _generateBody(visibleItems, user, reportType) {
    let report = '';
    let total = 0;

    for (const item of visibleItems) {
      
      if (user.role === 'ADMIN' && item.value > 1000) {
        item.priority = true;
      }
      
      report += this._formatItemRow(item, user, reportType);
    
      total += item.value;
    }

    return { report, total };
  }

  _formatItemRow(item, user, reportType) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    
    if (reportType === 'HTML') {
      const style = item.priority ? ' style="font-weight:bold;"' : '';
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>
`;
    }
    
    return '';
  }

  _generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }
    
    if (reportType === 'HTML') {
      return `</table>
<h3>Total: ${total}</h3>
</body></html>
`;
    }
    return '';
  }
}