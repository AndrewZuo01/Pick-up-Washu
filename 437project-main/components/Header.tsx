import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <Link href="/">
        <a className='link' data-active={isActive('/')}>
          <strong>Pick-Up WashU</strong>
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = left;
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a className='link' data-active={isActive('/signup')}>Log in</a>
        </Link>
      </div>
    );
  }

  if (session) {
    left = left;
    right = (
      <div className="right">
        <Link href="/about">
          <button className="nav-btn btn">
            <a>About</a>
          </button>
        </Link>
        <Link href="/profile">
          <button className='nav-btn btn'>
            <a>My Profile</a>
          </button>
        </Link>
        <Link href="/create">
          <button className='nav-btn btn'>
            <a>Create Event</a>
          </button>
        </Link>
        <Link href="/myEvents">
          <button className='nav-btn btn'>
            <a>My Events</a>
          </button>
        </Link>
        <button className='nav-btn btn' onClick={() => signOut()}>
          <a>Log Out</a>
        </button>
      </div>
    );
  }

  return (
    <nav className="navbar-light bg-light nav-bar">
      {left}
      {right}
    </nav>
  );
};

export default Header;