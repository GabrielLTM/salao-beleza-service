import { z } from 'zod';

export const guidSchema = z.string().min(1, 'id eh obrigatorio.');

export const paramIdSchema = z.object({ id: guidSchema });

// Regex que aceita AAAA-MM-DD ou DD/MM/AAAA (e variações com traço)
const formatoDataRegex = /^(\d{4}-\d{2}-\d{2}(T.*)?)|(\d{2}[\/\-]\d{2}[\/\-]\d{4})$/;

const dataBaseSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === '' || formatoDataRegex.test(val),
    'Formato de data inválido. Utilize DD/MM/AAAA ou AAAA-MM-DD.'
  )
  .transform((val) => {
    if (val === '') return null;
    
    // Se a data chegar no formato brasileiro (DD/MM/AAAA ou DD-MM-AAAA), converte para o padrão do banco (AAAA-MM-DD)
    if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(val)) {
      const separador = val.includes('/') ? '/' : '-';
      const [dia, mes, ano] = val.split(separador);
      return `${ano}-${mes}-${dia}`;
    }
    
    return val;
  })
  .refine((val) => {
    if (val === null) return true;
    
    const date = new Date(val);
    
    // Valida se a conversão resultou em "Invalid Date" (ex: mês 15)
    if (isNaN(date.getTime())) return false;
    
    // Trava estrita: impede que o JS faça o "rollover" de datas irreais (ex: transformar 31 de fevereiro em 02 de março)
    const [anoString, mesString, diaString] = val.split('T')[0].split('-');
    return (
      date.getUTCFullYear() === Number(anoString) &&
      date.getUTCMonth() + 1 === Number(mesString) &&
      date.getUTCDate() === Number(diaString)
    );
  }, 'A data informada é inexistente ou irreal no calendário.')
  .nullable()
  .optional();

// Data opcional genérica (usada para agendas ou campos sem restrição de passado/futuro)
export const dataOpcionalSchema = dataBaseSchema;

// Schema específico para datas que NÃO podem estar no futuro
export const dataPassadaSchema = dataBaseSchema.refine((val) => {
  if (!val) return true;
  
  // Ignora a hora para comparar apenas o dia
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataFornecida = new Date(val);
  dataFornecida.setHours(0, 0, 0, 0);
  
  return dataFornecida <= hoje;
}, 'Esta data não pode pertencer ao futuro.');

// Exportando os esquemas restritos
export const dataNascimentoSchema = dataPassadaSchema;