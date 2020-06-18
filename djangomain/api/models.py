from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


# Manages our Custom User Model
class UserProfileManager(BaseUserManager):
	# Creates a new user profile object
	def create_user(self, email, name, password=None):
		# Make email unique and compulsory for all users
		if not email:
			raise ValueError('Users must have an email address.')
		# Normalize helps to lowercase all email characters
		email = self.normalize_email(email)
		# Create user profile object
		user = self.model(email=email, name=name)
		user.set_password(password)
		user.save(using=self._db)
		return user

	# Allows us to create a superuser in the command prompt
	def create_superuser(self, email, name, password):
		# Create superuser profile object
		user = self.create_user(email, name, password)
		user.is_superuser = True
		user.is_staff = True
		user.save(using=self._db)
		return user


# Custom User Model
class UserProfile(AbstractBaseUser, PermissionsMixin):
	# Fields which our Custom User Model will have
	# blank=True means that the field does not have to be filled up in the form. null=True means that we will fill,
	# at the database level, the field with a null. (Filling the field with an empty string at the data base level
	# causes a lot of problems)
	email = models.EmailField(max_length=225, unique=True)
	name = models.CharField(max_length=225, blank=True, null=True)
	biography = models.TextField(max_length=500, blank=True, null=True)
	linkedin = models.URLField(max_length=225, blank=True, null=True)
	profile_picture = models.ImageField(blank=True, null=True)
	# is_active is used to determine if the user is currently active in the system
	# Used for kicking out inactive users from the site
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)

	# User profiles are handled by the UserProfileManager
	objects = UserProfileManager()

	# Log in with email and password, and make name mandatory while registering
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['name']

	# Show display name if user has input a display name, otherwise username.
	def __str__(self):
		return self.name


# Details of stock counter (e.g What is the name / code of stock, and which exchange it belongs to)
# E.g name=COMFORTDELGRO CORPORATION LTD, code=C52, exchange=SGX)
class StockCounter(models.Model):
	name = models.CharField(max_length=200, blank=False, unique=True)
	code = models.CharField(max_length=10, blank=False)
	exchange = models.CharField(max_length=200, blank=True)

	def __str__(self):
		return self.name


# Creates stock analyses written by users
class StockAnalysis(models.Model):
	# StockAnalyse has a One-To-Many relationship with User
	# to_field declares what name (e.g Display Name / Stock Name) the ForeignKey will take on in JSON format
	author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, to_field='email')
	stock = models.ForeignKey(StockCounter, on_delete=models.CASCADE, null=True, blank=False, to_field='name')
	text = models.TextField()
	created_date = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return "%s's %s Analysis" % (self.author, self.stock)


# Stores images created in stock analyses
class StockAnalysisImage(models.Model):
	analysis = models.ForeignKey(StockAnalysis, related_name='images', on_delete=models.CASCADE)
	image = models.ImageField()
