import React from 'react';
import { Card, CardContent, Button } from '@/components/ui';

const Footer = () => {
  return (
    <Card className="mt-8">
      <CardContent className="flex justify-between items-center">
        <Button variant="secondary" href="/">
          Back to Landing
        </Button>
        <div>
          <a href="/help" className="mr-4">
            Help
          </a>
          <a href="/faq">FAQ</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default Footer;