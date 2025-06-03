'use client';

import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [list, setList] = useState<{ name: string; price: number; code?: string }[]>([]);

  const handleRead = async () => {
    try {
      const res = await fetch(`http://localhost:8000/product/${code}`);
      const data = await res.json();
      if (data) {
        setName(data.NAME);      // ← 修正：大文字
        setPrice(data.PRICE);    // ← 修正：大文字
      } else {
        setName('未登録商品');
        setPrice(0);
      }
    } catch (err) {
      console.error('API呼び出し失敗:', err);
      setName('エラー');
      setPrice(0);
    }
  };

  const handleAdd = () => {
    // 商品コードも一緒に保持するためcodeを追加
    setList([...list, { name, price, code }]);
    setCode('');
    setName('');
    setPrice(0);
  };

  // 購入ボタン押下時の処理
  const handlePurchase = async () => {
    const purchaseData = {
      emp_cd: "9999999999",     // 仮のレジ担当者コード
      store_cd: "30",           // 仮の店舗コード
      pos_no: "90",             // 仮のPOS機ID
      items: list.map(item => ({
        code: item.code || '',
        name: item.name,
        price: item.price,
      })),
    };

    try {
      const res = await fetch("http://localhost:8000/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });
      const data = await res.json();
      if (data.success) {
        alert(`購入成功！合計金額: ${data.total} 円`);
        setList([]);  // リストをクリア
      } else {
        alert("購入失敗しました");
      }
    } catch (error) {
      alert("購入処理でエラーが発生しました");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>POSアプリ</h1>
      <input
        type="text"
        placeholder="商品コード"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleRead}>商品コード読み込み</button>

      <div>商品名: {name}</div>
      <div>単価: {price}円</div>

      <button onClick={handleAdd}>追加</button>

      <h2>購入リスト</h2>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price}円
          </li>
        ))}
      </ul>

      {/* 追加した購入ボタン */}
      <button onClick={handlePurchase}>購入</button>
    </div>
  );
}
