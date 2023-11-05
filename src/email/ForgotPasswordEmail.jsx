import {
    Html,Body,Head,Heading,Hr,Container,Preview,Section,Text,Button
} from '@react-email/components';
import {Tailwind} from '@react-email/tailwind'
import * as React from 'react';

export default function ForgotPasswordEmail({params}){
  return (
    <Html>
    <Head>
      <title>My email</title>
    </Head>
    <Body>
     <Heading as="h1">HELLO {params.name}</Heading>
      <Text>
        We received the reset password request. if it's not you then pls ignore
        it.
      </Text>
      <Button
        pX={20}
        pY={20}
        className={"bg-red-200 text-white p-2 m-2"}
        href={params.url}
        style={{ background: "#000", color: "#FFFFFF",padding:"4px" }}
      >
        Click Me
      </Button>
      <Hr />

      <Heading as="h3">Regards</Heading>
      <Heading as="h2">thanks {params.name}</Heading>
      <Text>NextAuth project</Text>
    </Body>
    </Html>
  );
}