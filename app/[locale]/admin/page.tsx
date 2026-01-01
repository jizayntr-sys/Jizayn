import { redirect } from 'next/navigation';

export default function AdminPage() {
  // /admin rotasına gelen istekleri doğrudan dashboard'a yönlendir
  redirect('/admin/dashboard');
  
  return null;
}