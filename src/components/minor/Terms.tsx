import { useState, useRef } from 'react';
import { Container, Content, Panel, Divider, Heading, Text, Modal, Button, Stack } from 'rsuite';

const lsAccepted = 'accepted';

const TermsOfService = () => {
    const [accepted, setAccepted] = useState(() => {
        const saved = localStorage.getItem(lsAccepted);
        return !!saved;
    });
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const node = scrollContainerRef.current;
        if (node) {
            const isAtBottom = node.scrollHeight - node.scrollTop <= node.clientHeight + 1;
            
            if (isAtBottom) {
                setHasScrolledToBottom(true);
            }
        }
    };
    const sectionStyle = { marginBottom: '20px' };
    const containerStyle = { 
        minHeight: '100vh' 
    };
    const panelStyle = { 
        maxWidth: '800px', 
        margin: '0 auto', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
    };
    
    const updateAccepted = () => {
        setAccepted(true);
        localStorage.setItem(lsAccepted, 'true');
    }

    return (
        <Modal open={!accepted} onClose={() => (false)} size={'full'} role="alertdialog">
            <Modal.Body ref={scrollContainerRef} onScroll={handleScroll} >
                <Container style={containerStyle}>
                    <Content >
                        <Panel style={panelStyle}>
                            <Heading level={2} style={{ textAlign: 'center', marginBottom: '10px' }}>
                                Terms of Service
                            </Heading>
                            <Text muted style={{ textAlign: 'center', display: 'block', marginBottom: '30px' }}>
                                Last Updated: May 9, 2026
                            </Text>

                            <Divider />

                            <div style={sectionStyle}>
                                <Heading level={4}>1. Acceptance of Terms</Heading>
                                <Text>
                                    By accessing or using this website, you agree to be bound by these Terms of Service 
                                    and all applicable laws. If you do not agree, you are prohibited from using this site.
                                </Text>
                            </div>

                            <div style={sectionStyle}>
                                <Heading level={4}>2. Use License</Heading>
                                <Text>
                                    Permission is granted to temporarily download one copy of the materials for personal, 
                                    non-commercial transitory viewing only. You may not modify the materials or use them 
                                    for commercial purposes.
                                </Text>
                            </div>

                            <div style={sectionStyle}>
                                <Heading level={4}>3. Disclaimer</Heading>
                                <Text>
                                    The materials on this website are provided on an 'as is' basis. We make no warranties, 
                                    expressed or implied, and hereby disclaim and negate all other warranties.
                                </Text>
                            </div>

                            <div style={sectionStyle}>
                                <Heading level={4}>4. Limitations of Liability</Heading>
                                <Text>
                                    In no event shall [Your Website Name] or its suppliers be liable for any damages 
                                    (including loss of data or profit) arising out of the use or inability to use 
                                    the materials on this website.
                                </Text>
                            </div>

                            <div style={sectionStyle}>
                                <Heading level={4}>5. Governing Law</Heading>
                                <Text>
                                    These terms and conditions are governed by and construed in accordance with the laws 
                                    of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction 
                                    of the courts in that location.
                                </Text>
                            </div>

                            <Divider />

                            <footer style={{ marginTop: '20px', marginBottom: 20, textAlign: 'center' }}>
                                <Text muted size="sm">
                                    &copy; 2026 [Your Website Name]. All rights reserved.
                                </Text>
                            </footer>
                        </Panel>
                    </Content>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{paddingTop: 20}}>
                <Stack justifyContent="flex-end" >
                    <Text hidden={hasScrolledToBottom} muted>Scroll down to continue...</Text>
                    <Button 
                        appearance="primary" 
                        disabled={!hasScrolledToBottom}
                        onClick={() => updateAccepted()}
                        title={!hasScrolledToBottom ? "Please scroll to the bottom to accept" : ""}
                    >
                        Accept
                    </Button>
                </Stack>
            </Modal.Footer>
        </Modal>
    );
};

export default TermsOfService;