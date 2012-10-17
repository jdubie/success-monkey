push:
	rsync --recursive --verbose --delete site/* prod:~/success-monkey
