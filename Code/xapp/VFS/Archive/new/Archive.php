<?php
class xapp_Archive2
{
	/**
	 * The array of instantiated archive adapters.
	 *
	 * @var    array
	 * @since  1.0
	 */
	protected $adapters = array();

	/**
	 * Holds the options array.
	 *
	 * @var    mixed  Array or object that implements \ArrayAccess
	 * @since  1.0
	 */
	public $options = array();

	/**
	 * Create a new Archive object.
	 *
	 * @param   mixed  $options  An array of options or an object that implements \ArrayAccess
	 *
	 * @since   1.0
	 */
	public function __construct($options = array())
	{
		// Make sure we have a tmp directory.
		isset($options['tmp_path']) or $options['tmp_path'] = realpath(sys_get_temp_dir());

		$this->options = $options;
	}

	/**
	 * Extract an archive file to a directory.
	 *
	 * @param   string  $archivename  The name of the archive file
	 * @param   string  $extractdir   Directory to unpack into
	 *
	 * @return  boolean  True for success
	 *
	 * @since   1.0
	 * @throws  \InvalidArgumentException
	 */
	public function extract($archivename, $extractdir)
	{
		$ext = pathinfo($archivename, PATHINFO_EXTENSION);
		$path = pathinfo($archivename, PATHINFO_DIRNAME);
		$filename = pathinfo($archivename, PATHINFO_FILENAME);

		switch ($ext)
		{
			case 'zip':
				$result = $this->getAdapter('zip')->extract($archivename, $extractdir);
				break;

			case 'tar':
				$result = $this->getAdapter('tar')->extract($archivename, $extractdir);
				break;

			case 'tgz':
			case 'gz':
			case 'gzip':
				// This may just be an individual file (e.g. sql script)
				$tmpfname = $this->options['tmp_path'] . '/' . uniqid('gzip');
				$gzresult = $this->getAdapter('gzip')->extract($archivename, $tmpfname);

				if ($gzresult instanceof \Exception)
				{
					@unlink($tmpfname);

					return false;
				}

				if ($ext === 'tgz' || stripos($filename, '.tar') !== false)
				{
					$result = $this->getAdapter('tar')->extract($tmpfname, $extractdir);
				}
				else
				{
					Folder::create($path);
					$result = File::copy($tmpfname, $extractdir, null, 0);
				}

				@unlink($tmpfname);

				break;

			case 'tbz2':
			case 'bz2':
			case 'bzip2':
				// This may just be an individual file (e.g. sql script)
				$tmpfname = $this->options['tmp_path'] . '/' . uniqid('bzip2');
				$bzresult = $this->getAdapter('bzip2')->extract($archivename, $tmpfname);

				if ($bzresult instanceof \Exception)
				{
					@unlink($tmpfname);

					return false;
				}

				if ($ext === 'tbz2' || stripos($filename, '.tar') !== false)
				{
					$result = $this->getAdapter('tar')->extract($tmpfname, $extractdir);
				}
				else
				{
					Folder::create($path);
					$result = File::copy($tmpfname, $extractdir, null, 0);
				}

				@unlink($tmpfname);

				break;

			default:
				throw new Exception(sprintf('Unknown archive type: %s', $ext));
		}

		if (!$result || $result instanceof Exception)
		{
			return false;
		}

		return true;
	}

	/**
	 * Method to override the provided adapter with your own implementation.
	 *
	 * @param   string   $type      Name of the adapter to set.
	 * @param   string   $class     FQCN of your class which implements ExtractableInterface.
	 * @param   boolean  $override  True to force override the adapter type.
	 *
	 * @return  Archive  This object for chaining.
	 *
	 * @since   1.0
	 * @throws  Exception
	 */
	public function setAdapter($type, $class, $override = true)
	{
		if ($override || !isset($this->adapters[$type]))
		{
			$error = !is_object($class) && !class_exists($class)
					? 'Archive adapter "%s" (class "%s") not found.'
					: '';

			$error = $error == '' && !($class instanceof ExtractableInterface)
					? 'The provided adapter "%s" (class "%s") must implement Joomla\\Archive\\ExtractableInterface'
					: $error;

			$error = $error == '' && !$class::isSupported()
					? 'Archive adapter "%s" (class "%s") not supported.'
					: $error;

			if ($error != '')
			{
				throw new Exception(
					sprintf($error, $type, $class)
				);
			}

			$this->adapters[$type] = new $class($this->options);
		}

		return $this;
	}

	/**
	 * Get a file compression adapter.
	 *
	 * @param   string  $type  The type of adapter (bzip2|gzip|tar|zip).
	 *
	 * @return  ExtractableInterface  Adapter for the requested type
	 *
	 * @since   1.0
	 * @throws  Exception
	 */
	public function getAdapter($type)
	{
		$type = strtolower($type);

		if (!isset($this->adapters[$type]))
		{
			// Try to load the adapter object
			/* @var  ExtractableInterface  $class */
			$class = 'xapp_' . ucfirst($type);
			xapp_clog('class ' .$class . ' t ' . $type);
			xapp_import('xapp.VFS.Archive.new.'.ucfirst($type));
			if (!class_exists($class) || !$class::isSupported())
			{
				throw new Exception(
					sprintf(
						'Archive adapter "%s" (class "%s") not found or supported.',
						$type,
						$class
					)
				);
			}

			$this->adapters[$type] = new $class($this->options);
		}

		return $this->adapters[$type];
	}
}
