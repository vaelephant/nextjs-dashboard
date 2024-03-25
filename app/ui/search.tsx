'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
//从 'next/navigation' 导入 useSearchParams 钩子，并将其分配给一个变量
import { useSearchParams,usePathname, useRouter} from 'next/navigation';
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  function handleSearch(term: string) {
    //查看抖动情况
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    // /默认页面为第一页
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    // ${pathname} 是当前路径，在您的情况下为 "/dashboard/invoices" 。

    console.log(term);
  }
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // 为了确保输入字段与 URL 同步并在共享时填充，您可以通过读取 searchParams 来将 defaultValue 传递给输入：
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
