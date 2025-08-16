import type { Produto } from "@/types"; // ✅ Importe a interface
import LinhaProduto from "@/components/LinhaProduto";

interface TabelaProdutosProps {
  produtos: Produto[];
  erros: boolean[];
  linhaAtiva: number | null;
  campoEditando: { linha: number; campo: string } | null;
  valoresEditando: { [key: string]: string };
  onChange: (index: number, field: keyof Produto, value: string | number) => void; // ✅ keyof Produto
  onFocusMoeda: (index: number, campo: string) => void;
  onBlurMoeda: () => void;
  onRemove: (index: number) => void;
}

export default function TabelaProdutos({
  produtos,
  erros,
  linhaAtiva,
  campoEditando,
  valoresEditando,
  onChange,
  onFocusMoeda,
  onBlurMoeda,
  onRemove,
}: TabelaProdutosProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qtd</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Un</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Unit.</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mercado</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((p, idx) => (
            <LinhaProduto
              key={p.id}
              produto={p}
              index={idx}
              isActive={linhaAtiva === idx}
              hasError={erros[idx]}
              campoEditando={campoEditando}
              valoresEditando={valoresEditando}
              onChange={onChange}
              onFocusMoeda={onFocusMoeda}
              onBlurMoeda={onBlurMoeda}
              onRemove={onRemove}
              disabledRemove={produtos.length === 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}