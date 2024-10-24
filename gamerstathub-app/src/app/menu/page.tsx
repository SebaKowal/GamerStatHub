import Link from 'next/link';

const MenuPage = () => {
  const users = ['john', 'anna', 'mark'];

  return (
    <div>
      <h1>Lista użytkowników</h1>
      <ul>
        {users.map((nick) => (
          <li key={nick}>
            <Link href={`/menu/userHistory/${nick}`}>
              <>{nick}</>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
