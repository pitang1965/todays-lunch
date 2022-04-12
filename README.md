# 今日のお弁当
## 概要
* 平田食堂の次のお昼のお弁当を注文するアプリです。メール送信による注文です。

## 使用している技術、サービス及びライブラリ
### [Airtable](https://airtable.com/)
* スプレッドシートの親しみやすさでリレーショナルデータベースを作成及び共有できるサービス。
* 本プロジェクトではメニューの詳細、利用可能性などのデータを格納する予定。
### [Auth0](https://auth0.com/)
* Eメール又はGoogleでログイン。
* [@auth0/nextjs-auth0](https://github.com/auth0/nextjs-auth0#readme)から利用。
### [headless UI](https://headlessui.dev/)
* スタイルのないUIコンポーネントでTailwind CSSと組み合わせて使う。
* 本プロジェクトでは、[Listbox(Select)](https://headlessui.dev/react/listbox)、[Menu(Dropdown)](https://headlessui.dev/react/menu)及び[Transition](https://headlessui.dev/react/transition)を使用。
### [heroicons](https://heroicons.com/)
* アイコン集
### [Next.js](https://nextjs.org/) 
* Reactフレームワーク
*  [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)でプロジェクトを生成。
### [MailerSend](https://www.mailersend.com/)
* 電子メール送信サービス
* 弁当注文及び問い合わせのメール送信に利用。
### [next-pwa](https://openbase.com/js/next-pwa)
* ほとんど設定することなくNext.jsのWebサイトをPWA(Progressive Web App)化する。
### [React Hook Form](https://react-hook-form.com/)
* 簡単にバリデーションする機能を持つReact用フォームライブラリ。
### [React-toastify](https://fkhadra.github.io/react-toastify/introduction)
* アプリに簡単に通知を追加。
### [Tailwind CSS](https://tailwindcss.com/)
* HTMLに直接スタイリングを指定できるCSSフレームワーク。
### [TypeScript](https://www.typescriptlang.org/)
* 型の構文を備えたJavaScript。
### [Vercel](https://vercel.com)
* サーバーレスデプロイをおこなうためのクラウドプラットフォーム。
* AirtableやSendGridのAPIは[Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)で実行。
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
