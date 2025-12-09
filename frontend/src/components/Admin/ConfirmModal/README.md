# ConfirmModal - Modal de Confirmação Reutilizável

Componente de modal de confirmação reutilizável para uso em todo o sistema administrativo.

## Uso Básico

```tsx
import { useState } from 'react';
import ConfirmModal from '../../../components/Admin/ConfirmModal';

const MeuComponente = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Sua lógica aqui
      await fazerAlgumaAcao();
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Excluir</button>
      
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmButtonClass="danger"
        loading={loading}
      />
    </>
  );
};
```

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|-----------|
| `isOpen` | `boolean` | Sim | - | Controla se o modal está aberto |
| `onClose` | `() => void` | Sim | - | Função chamada ao fechar o modal |
| `onConfirm` | `() => void` | Sim | - | Função chamada ao confirmar |
| `title` | `string` | Sim | - | Título do modal |
| `message` | `string` | Sim | - | Mensagem de confirmação |
| `confirmText` | `string` | Não | `'Confirmar'` | Texto do botão de confirmação |
| `cancelText` | `string` | Não | `'Cancelar'` | Texto do botão de cancelamento |
| `confirmButtonClass` | `'primary' \| 'danger' \| 'warning'` | Não | `'primary'` | Estilo do botão de confirmação |
| `loading` | `boolean` | Não | `false` | Mostra estado de carregamento |

## Exemplos de Uso

### Exclusão (Danger)
```tsx
<ConfirmModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleDelete}
  title="Excluir Item"
  message="Esta ação não pode ser desfeita."
  confirmText="Excluir"
  confirmButtonClass="danger"
  loading={loading}
/>
```

### Aviso (Warning)
```tsx
<ConfirmModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleAction}
  title="Atenção"
  message="Esta ação pode ter consequências."
  confirmText="Continuar"
  confirmButtonClass="warning"
/>
```

### Confirmação Simples (Primary)
```tsx
<ConfirmModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleSave}
  title="Salvar Alterações"
  message="Deseja salvar as alterações?"
  confirmText="Salvar"
  confirmButtonClass="primary"
/>
```

## Recursos

- ✅ Fecha ao pressionar ESC
- ✅ Fecha ao clicar no backdrop
- ✅ Previne scroll do body quando aberto
- ✅ Animações suaves
- ✅ Responsivo
- ✅ Estados de loading
- ✅ Acessível (aria-labels)

