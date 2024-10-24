// app/menu/user/[nick]/page.tsx
import { useRouter } from 'next/navigation';

const UserPage = ({ params }: { params: { nick: string } }) => {
  const { nick } = params; // Pobiera wartość "nick" z URL-a

  return (
    <div>
      <h1>Profil użytkownika: {nick}</h1>
      {/* Tutaj możesz dodać dane specyficzne dla użytkownika */}
    </div>
  );
};

export default UserPage;
