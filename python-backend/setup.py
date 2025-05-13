from setuptools import setup, find_packages

setup(
    name="bunker_baba",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'flask==2.0.1',
        'flask-cors==3.0.10',
        'python-dotenv==0.19.0',
        'easyocr==1.7.1',
        'google-generative-ai',
        'pillow==10.0.0',
        'numpy==1.24.3',
        'opencv-python==4.9.0.80',
        'pymongo==4.6.1',
        'werkzeug==3.0.1',
        'torch==2.1.2',
        'torchvision==0.16.2'
    ],
) 