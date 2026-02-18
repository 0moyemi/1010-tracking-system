'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to orders page by default
        // router.replace('/orders'); // Removed: Orders section no longer exists
    }, [router]);

    return null;
}
